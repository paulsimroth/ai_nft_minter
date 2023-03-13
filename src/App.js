import { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import axios from 'axios';

// Components
import Spinner from 'react-bootstrap/Spinner';
import Navigation from './components/Navigation';

// ABIs
import NFT from './abis/NFT.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [instance, setInstance] = useState(null);

  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [image, setImage] = useState(null);
  const [url, setURL] = useState(null);

  const [isWaiting, setIsWaiting] = useState(false);
  const [message, setMessage] = useState(false);

  //Connecting tp Blockchain and fetching data
  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    const instance = new ethers.Contract(config[network.chainId].nft.address, NFT, provider);
    setInstance(instance);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (name === "" || description === "") {
      window.alert("Please provide a name and description");
      return;
    };

    setIsWaiting(true);
    
    //Calling API to generate Image based on description
    const imageData = createImage();

    //Uploading Image to IPFS using NFT.Storage
    const url = await uploadImage(imageData);

    //Mint NFT
    await mintImage(url);

    setIsWaiting(false);
    setMessage("");
  };

  const createImage = async () => {
    setMessage("Creating Image...");

    // URL of AI model
    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`

    // Sending request
    const response = await axios({
      method: 'POST',
      url: URL,
      headers: {
        Authorization: `Bearer ${ process.env.HUGGING_FACE_API_KEY }`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: description, options: { wait_for_model: true },
      }),
      responseType: 'arraybuffer',
    });

    const type = response.headers['content-type'];
    const data = response.body;

    //Converting image to display on page
    const base64data = Buffer.from(data).toString('base64');
    const img = `data:${type};base64,` + base64data;
    setImage(img);

    return data;
  };

  const uploadImage = async (imageData) => {
    setMessage("Uploading Image...");

    //Creating Instance of NFT.Storage
    const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

    //Sending request to store image
    const { ipnft } = await nftStorage.store({
      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description,
    });

    //Save URL
    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
    setURL(url);

    return url;
  };

  const mintImage = async (tokenURI) => {
    setMessage("Waiting for mint...");

    const signer = await provider.getSigner();
    const tx = await instance.connect(signer).mint(tokenURI, { value: ethers.utils.parseUnits("1", "ether") });
    await tx.wait();
  };

  useEffect(() => {
    loadBlockchainData()
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      
      <div className='form'>

        <form onSubmit={submitHandler}>
          <input type="text" placeholder='Create a name...' onChange={(e) => { setName(e.target.value) }}></input>
          <input type="text" placeholder='Create a description...' onChange={(e) => { setDescription(e.target.value) }}></input>
          <input type="submit" value='Create & Mint'></input>
        </form>

        <div className='image'>

          { !isWaiting && image ? (
            <img src={image} alt="AI generated Image"/>
          ) : isWaiting ? ( 
            <div className='image__placeholder'>
              <Spinner animation='border' />
              <p>{message}</p>
            </div>
          ) : (
            <></>
          )}

        </div>

      </div>

      { !isWaiting && url && (
        <p>View&nbsp;<a href={url}>Metadata</a></p>
      )}
      
    </div>
  );
};

export default App;
