import {Center, Container, Group, Loader, Menu, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import {useListTransactionsQuery} from "../graphql/generated";
import React from "react";
import {DefaultLayout} from "../layouts/DefaultLayout";
import Divider = Menu.Divider;

export default function Home() {
    const {status, data, error, isLoading} = useListTransactionsQuery({
        tagFilter: [
            {name: "App-Name", values: ["ERS"]},
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
                <Title sx={{fontFamily: "monospace"}}>SiLo Chips:</Title>
                <Stack>
                    {edges?.map((edge, i) => {
                        const node = edge.node

                        const meta: { name: string, description: string } = JSON.parse(safeTag(node, "Device-Token-Metadata", null))

                        let ipfsCid = safeTag(node, "IPFS-Add", null)

                        return (
                            <Stack key={`Edge-${i}`}>
                                <SimpleGrid cols={2}>
                                    <Group sx={{fontFamily: "monospace"}} noWrap>
                                        <Text color={"dimmed"} inherit>Name:</Text>
                                        <Text inherit>{meta?.name}</Text>
                                    </Group>
                                    <Group sx={{fontFamily: "monospace"}} noWrap>
                                        <Text color={"dimmed"} inherit>Description:</Text>
                                        <Text lineClamp={1} inherit>{meta?.description}</Text>
                                    </Group>
                                    <Group sx={{fontFamily: "monospace"}} noWrap>
                                        <Text color={"dimmed"} inherit>Device Id:</Text>
                                        <Text inherit>{truncate(safeTag(node, "Device-Id", null), 24)}</Text>
                                    </Group>
                                    <Group sx={{fontFamily: "monospace"}} noWrap>
                                        <Text color={"dimmed"} inherit>Device Address:</Text>
                                        <Text inherit>{safeTag(node, "Device-Address", null) ?? "--"}</Text>
                                    </Group>
                                    <Group sx={{fontFamily: "monospace"}} noWrap>
                                        <Text color={"dimmed"} inherit>Device Signature:</Text>
                                        <Text
                                            inherit>{truncate(safeTag(node, "Device-Signature", null) ?? "--", 24)}</Text>
                                    </Group>
                                    <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                        <Text color={"dimmed"} inherit>Device-Minter:</Text>
                                        <Text inherit>{safeTag(node, "Device-Minter", null) ?? "--"}</Text>
                                    </Group>
                                    <Group sx={{fontFamily: "monospace"}} noWrap>
                                        <Text color={"dimmed"} inherit>Device Minter Chain Id:</Text>
                                        <Text inherit>{safeTag(node, "Device-Minter-Chain-Id", null) ?? "--"}</Text>
                                    </Group>
                                    <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                        <Text color={"dimmed"} inherit>IPFS CID:</Text>
                                        <Text inherit>{safeTag(node, "IPFS-Add", null) ?? "--"}</Text>
                                    </Group>
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

const safeTag = (node, tagName, defaultValue) => {
    const tag = node.tags.find((tag) => tag.name === tagName)
    return tag ? tag.value : defaultValue
}

const truncate = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr;

    let separator = '...';

    const sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    return fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars);
};

Home.Layout = DefaultLayout