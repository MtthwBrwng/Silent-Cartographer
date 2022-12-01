import {Center, Container, Group, Loader, Menu, Paper, SimpleGrid, Stack, Text} from "@mantine/core";
import {useListTransactionsQuery} from "../graphql/generated";
import React from "react";
import Divider = Menu.Divider;

export default function Home() {
    const {status, data, error, isLoading} = useListTransactionsQuery({
        tagFilter: [
            {name: "App-Name", values: ["ERS"]}
        ]
    })

    if (isLoading) {
        return (
            <Center py={50}>
                <Loader variant={"dots"} size={"lg"}/>
            </Center>
        )
    }

    const edges = data?.transactions?.edges

    return (
        <Container py={50}>
            <Paper radius={"lg"} p={"md"} withBorder>
                <Stack>
                    {edges?.map((edge, i) => {
                        const node = edge.node

                        return (
                            <Stack>
                                <SimpleGrid key={`Edge-${i}`} cols={2}>
                                    {node?.tags?.map((tag) => (
                                        <Group key={tag?.name} sx={{fontFamily: "monospace"}}>
                                            <Text color={"dimmed"} inherit>{tag?.name}:</Text>
                                            <Text lineClamp={1} inherit>{tag?.value}</Text>
                                        </Group>
                                    ))}
                                </SimpleGrid>
                                <Divider/>
                            </Stack>

                        )
                    })}
                </Stack>
            </Paper>

        </Container>
    )
}