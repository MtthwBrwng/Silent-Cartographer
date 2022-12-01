import {MantineProvider} from "@mantine/core";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

const App = ({Component, pageProps}) => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: "dark"}}>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </MantineProvider>
    )
}

export default App
