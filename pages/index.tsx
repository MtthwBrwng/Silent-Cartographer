import {Center, Container, Group, Loader, Menu, Paper, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import {useListTransactionsQuery} from "../graphql/generated";
import React from "react";
import {DefaultLayout} from "../layouts/DefaultLayout";
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
        <Container>
            <Stack>
                <Title>Chips</Title>
                <Stack>
                    {edges?.map((edge, i) => {
                        const node = edge.node

                        return (
                            <Stack key={`Edge-${i}`}>
                                <SimpleGrid cols={2}>
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
            </Stack>
        </Container>
    )
}

Home.Layout = DefaultLayout