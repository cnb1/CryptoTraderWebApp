import React from 'react';
import App from './App';
import {ApolloClient} from '@apollo/client';
import {InMemoryCache} from '@apollo/client';
import {createHttpLink} from '@apollo/client';
import {ApolloProvider} from '@apollo/client';
import {setContext} from 'apollo-link-context';
import './App.css'


const httplink = createHttpLink({
    uri: 'http://localhost:3005/graphql'
})

const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return{
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httplink),
    cache: new InMemoryCache()
})



export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)