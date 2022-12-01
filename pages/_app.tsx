import {MantineProvider} from "@mantine/core";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://arweave.net/graphql',
    cache: new InMemoryCache(),
});
const App = ({Component, pageProps}) => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: "dark"}}>
            <ApolloProvider client={client}>
                <Component {...pageProps} />
            </ApolloProvider>
        </MantineProvider>
    )
}

export default App
