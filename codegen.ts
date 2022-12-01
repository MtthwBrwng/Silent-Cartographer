import type {CodegenConfig} from '@graphql-codegen/cli';
import {GRAPHQL_ENDPOINT} from "./constants";

const config: CodegenConfig = {
    overwrite: true,
    schema: "https://arweave.net/graphql",
    documents: "graphql/**/*.graphql",
    generates: {
        "graphql/generated.ts": {
            plugins: ['typescript', 'typescript-operations', 'typescript-react-query'],
            config: {
                fetcher: {
                    endpoint: GRAPHQL_ENDPOINT,
                    fetchParams: {headers: {'Content-Type': 'application/json'}}
                }
            }
        }
    }
};

export default config;
