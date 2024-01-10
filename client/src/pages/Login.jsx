import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // to disable submit button when submitting
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData, 
      [e.target.id]:e.target.value,
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false)

      if (data.status === 'fail') {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/')
    } catch (err) {
      setLoading(false);
      setError(err.message);   
    }
  }; 

  return (
    <div
      className='p-3 max-w-lg mx-auto w-fit'
    >
      <h1 className='text-3xl text-center font-semibold my-7'>Log In</h1>
      <form 
        className='flex flex-col gap-4 w-80 m-auto'
        onSubmit={handleSubmit}
      >
        <input 
          type='email' 
          placeholder='email'
          className='border p-3 rounded-lg' 
          id='email' 
          onChange={handleChange} 
        />
        <input 
          type='password' 
          placeholder='password'
          className='border p-3 rounded-lg' 
          id='password' 
          onChange={handleChange} />
        <button 
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Log In'}
        </button>
      </form> 
      <div className='flex gap-2 w-fit mt-5 mx-auto'>
        <p>{`Don't have an account?`}</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 w-fit mt-5 m-auto'>{error}</p>}
    </div>
  )
}