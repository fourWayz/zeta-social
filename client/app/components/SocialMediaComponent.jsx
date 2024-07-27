"use client"
import React, { useState, useEffect } from 'react';
import { useContract } from '../../lib/Context';
import { ethers } from 'ethers';
import { useLogin } from '@privy-io/react-auth';
import { FaThumbsUp, FaCommentDots, FaLink } from "react-icons/fa";
import { Container, Navbar, Nav, Card, Button, Form, Alert, Row, Col, Spinner, Modal } from "react-bootstrap";


function SocialMediaComponent() {
  const { contract } = useContract();
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [commentText, setCommentText] = useState(''); // State for comment text
  const [socialAccount, setSocialAccount] = useState({ username: '', type: '' });
  const [showModal, setShowModal] = useState(false);




  useEffect(() => {
    connectToWallet();
  }, []);

  // fetch registered user onMount
  useEffect(() => {
    fetchRegisteredUser();
  }, [wallet]);

  // fetch post onMount
  useEffect(() => {
    if (contract) {
      fetchPosts();
    }
  }, [contract]);

  useEffect(() => {
    const storedSocialAccount = JSON.parse(localStorage.getItem('socialAccount'));
    if (storedSocialAccount) {
      setSocialAccount(storedSocialAccount);
    }
  }, []);

  const handleLoginComplete = (linkedAccount) => {
    const socialAccount = linkedAccount?.linkedAccounts?.find(account => 
      account.type === 'github_oauth' || account.type === 'google_oauth'
    );
  
    if (socialAccount) {
      const username = socialAccount?.username || socialAccount?.name;
  
      if (username) {
        localStorage.setItem('socialAccount', JSON.stringify({ username, type: socialAccount.type }));
        setSocialAccount({ username, type: socialAccount.type });
      }
    }
  };
  

  const { login } = useLogin({
    onComplete: handleLoginComplete,
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSocialLogin = (type) => {
    login();
    setShowModal(false);
  };

  // wallet connect functionality
  const connectToWallet = async function () {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        setWallet(provider.getSigner());
        setIsLoading(false);
      } else {
        throw new Error('Wallet connection not available.');
      }
    } catch (error) {
      console.error(error);
    }
  }
  // fetch posts function
  const fetchPosts = async function() {
    try {
      await getPosts();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }

  // register user function
  const fetchRegisteredUser = async function() {
    try {
      if (wallet) {

        const address = await wallet.getAddress();
        const user = await contract.getUserByAddress(address);
        if (user) {
          setRegisteredUser(user);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // user registration functionality
  const registerUser = async () => {
    try {
      setMessage('Registering, please wait!')
      const address = await wallet.getAddress();
      const tx = await contract.registerUser(username, { from: address });
      await tx.wait()
      setMessage('User registered successfully.');
      fetchRegisteredUser()

      setTimeout(() => {
        setMessage('');
      }, 3000);
      
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // creating post function
  const createPost = async () => {
    try {
      setMessage('Creating post, please wait!')
      const tx = await contract.connect(wallet).createPost(content);
      await tx.wait()
      setMessage('Post created successfully.');
      getPosts()

      setTimeout(() => {
        setMessage('');
        setContent('');
      }, 3000);

    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // liking post function
  const likePost = async (postId) => {
    try {
      setMessage('Liking post, please wait!')
      const tx = await contract.connect(wallet).likePost(postId);
      await tx.wait()
      setMessage('Post liked successfully.');

      setTimeout(() => {
        setMessage('');
      }, 3000);

      getPosts(); // Refresh posts after liking

    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // adding comment function
  const addComment = async (postId, comment) => {
    try {
      setMessage('Adding comment, please wait!')
      const tx = await contract.connect(wallet).addComment(postId, comment);
      await tx.wait()
      setMessage('Comment added successfully.');
      getPosts();

      setTimeout(() => {
        setMessage('');
        setCommentText('')
      }, 3000);

    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // getting posts function
  const getPosts = async () => {
    try {
      const count = await contract.getPostsCount(); 
      const fetchedPosts = [];
      for (let i = 0; i < count; i++) {
        const post = await contract.getPost(i);
        const comments = [];
        for (let j = 0; j < post.commentsCount; j++) {
          const comment = await contract.getComment(i, j);
          comments.push(comment);
        }
        fetchedPosts.push({ ...post, comments });
      }
      setPosts(fetchedPosts);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div className="container mt-5">
      {/* navbar section */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Social Media</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {registeredUser && (
                <li className="nav-item">
                  <button disabled className="btn btn-warning"> 
                    {registeredUser.userAddress.slice(0, 6)}...{socialAccount.username && `(${socialAccount.username})`}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* registration section  */}
      {!registeredUser && (
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Create Account</h5>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={registerUser} disabled={isLoading}>Register</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* create post section */}
      {registeredUser && (
        <>
         {!socialAccount.username && (
              <Row className="mt-3">
                <Col md={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Link Social Account</Card.Title>
                        <Button variant="primary" onClick={() => setShowModal(true)} className="mt-2">
                          <FaLink /> Link Social
                        </Button>
                      </Card.Body>
                    </Card>
                </Col>
              </Row>
            )}

        <div className="row mt-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Create Post</h5>
              <div className="mb-3">
                <textarea className="form-control" rows="3" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
              </div>
              <button className="btn btn-primary" onClick={createPost} disabled={isLoading}>Create Post</button>
            </div>
          </div>
        </div>
        </div>

        </>

      )}
     
    
      {/* post section */}
      <div className="mt-3">
        {message && <div className="alert alert-info" role="alert">{message}</div>}
        <h3>Posts</h3>
        <div className="row">
          {posts.map((post, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <div className="card shadow p-2 ">
                <div className="card-body">
                  <h6 className="card-title" style={{'color':'darkgrey'}}>Author : {post.author.toString()}</h6>
                  <p className="card-text" style={{'color':'darkgrey'}}>{post.content}</p>
                  <p className="card-text" style={{'color':'darkgrey'}}>Likes: {post.likes.toString()}</p>
                  {/* Like button */}
                  {registeredUser && (
                    <>
                     <button  className="btn btn-primary m-2" onClick={() => likePost(index)}>Like</button>
                      {/* Comment input and button */}
                      <input type="text" className="form-control m-2" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                      <button className="btn btn-secondary" onClick={() => addComment(index, commentText)}>Comment</button>
                    </>
                 
                  )}
                 {/* Comments */}
                  <div className="mt-3">
                    <h5>Comments</h5>
                    {post.comments.map((comment, commentIndex) => (
                      <div key={commentIndex}>
                        <p className='text-info'>{comment.content} <br />
                        <span className='text-primary'>{`${comment.commenter.slice(0,6)}...${comment.commenter.slice(comment.commenter.length -4)}`}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Social Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button variant="primary" onClick={() => handleSocialLogin('github')} className="m-2">
              <FaLink /> Link GitHub
            </Button>
            <Button className="m-2" variant="secondary" onClick={() => handleSocialLogin('google')}>
              <FaLink /> Link Google
            </Button>
          </Modal.Body>
        </Modal>
      
    </div>
  );
}

export default SocialMediaComponent;