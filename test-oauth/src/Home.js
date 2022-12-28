import React from 'react'

const Home = () => {
    const oauthHandler = () => {
        fetch('http://localhost:5555/auth/google').then((response) => console.log(response))
    }
    return (
        <div>
            <button onClick={oauthHandler}>Oauth Google</button>
        </div>
    )
}

export default Home
