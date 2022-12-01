import {Anchor, Button, Center, Container, Group, Loader, Menu, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import {TagOperator, useListTransactionsQuery} from "../graphql/generated";
import React, {useState} from "react";
import {DefaultLayout} from "../layouts/DefaultLayout";
import Divider = Menu.Divider;

export default function Home() {
    const [nextCursor, setNextCursor] = useState<string | undefined>()
    const {status, data, error, isLoading, isRefetching} = useListTransactionsQuery({
        tagFilter: [
            {name: "App-Name", values: ["ERS"]},
            {
                name: "Device-Record-Type",
                values: ["Device-Create"]
            },
            {name: "Device-Id", op: TagOperator.Neq, values: [""]},
        ],
        first: 25,
        after: nextCursor,
    }, {keepPreviousData: true, queryKey: ["chips", nextCursor],})

    if (isLoading && !isRefetching) {
        return (
            <Center py={50}>
                <Loader variant={"dots"} size={"lg"}/>
            </Center>
        )
    }

    const edges = data?.transactions?.edges
    const cursor = edges[edges.length - 1]?.cursor

    return (
        <Container>
            <Stack spacing={25}>
                <Group align={"center"} position={"apart"}>
                    <Title sx={{fontFamily: "monospace"}}>SiLo Chips:</Title>
                    <Button variant={"outline"} size={"xs"} radius={"sm"} onClick={() => setNextCursor(cursor)} loading={isRefetching}>Next</Button>
                </Group>
                {edges?.map((edge, i) => {
                    const node = edge.node

                    const meta: { name: string, description: string } = JSON.parse(safeTag(node, "Device-Token-Metadata", null))
                    const ipfsCid = safeTag(node, "IPFS-Add", null)

                    return (
                        <Stack key={`Edge-${i}`}>
                            <SimpleGrid cols={2}>
                                <Group sx={{fontFamily: "monospace"}} noWrap>
                                    <Text color={"dimmed"} inherit>Device Id:</Text>
                                    <Text inherit>{truncate(safeTag(node, "Device-Id", null), 40)}</Text>
                                </Group>
                                <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                    <Text color={"dimmed"} inherit>Device Address:</Text>
                                    <Anchor
                                        href={`https://etherscan.io/address/${safeTag(node, "Device-Address", null)}`}
                                        inherit>{truncate(safeTag(node, "Device-Address", null) ?? "--", 24)}</Anchor>

                                </Group>
                                <Group sx={{fontFamily: "monospace"}} noWrap>
                                    <Text color={"dimmed"} inherit>Device Manufacturer:</Text>
                                    <Text
                                        inherit>{truncate(safeTag(node, "Device-Manufacturer", null) ?? "--", 24)}</Text>
                                </Group>
                                <Group sx={{fontFamily: "monospace"}} noWrap>
                                    <Text color={"dimmed"} inherit>Device Model:</Text>
                                    <Text inherit>{truncate(safeTag(node, "Device-Model", null) ?? "--", 24)}</Text>
                                </Group>
                                <Group sx={{fontFamily: "monospace"}} noWrap>
                                    <Text color={"dimmed"} inherit>Device Record Type:</Text>
                                    <Text inherit>{safeTag(node, "Device-Record-Type", null)}</Text>
                                </Group>
                            </SimpleGrid>
                            <Divider/>
                        </Stack>
                    )
                })}
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