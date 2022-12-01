import {MantineProvider} from "@mantine/core";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";
import * as React from "react"

const queryClient = new QueryClient()

const App = ({Component, pageProps}) => {
    // @ts-ignore
    const Layout = Component.Layout ? Component.Layout : React.Fragment;

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: "dark"}}>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </QueryClientProvider>
        </MantineProvider>
    )
}

export default App
