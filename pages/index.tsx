import {Anchor, Center, Chip, Container, Divider, Group, Loader, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import {TagOperator, useListTransactionsQuery} from "../graphql/generated";
import React, {useState} from "react";
import {DefaultLayout} from "../layouts/DefaultLayout";

export default function Home() {
    const [deviceRecordTypeFilter, setDeviceRecordTypeFilter] = useState<string[] | undefined>(["Device-Create", "Device-Media", "Device-Event"])


    const {status, data, error, isLoading, isRefetching} = useListTransactionsQuery({
        tagFilter: [
            {name: "App-Name", values: ["ERS"]},
            {
                name: "Device-Record-Type",
                values: deviceRecordTypeFilter
            },
            {name: "Device-Id", op: TagOperator.Neq, values: [""]},
        ],
        first: 25,
    }, {keepPreviousData: true})

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
        <Container size={"md"}>
            <Stack spacing={25}>
                <Title sx={{fontFamily: "monospace"}}>SiLo Chips</Title>
                <Chip.Group position={"apart"} value={deviceRecordTypeFilter} onChange={(value => setDeviceRecordTypeFilter(value))} multiple>
                    <Chip size={"lg"} value="Device-Create">Device Create</Chip>
                    <Chip size={"lg"} value="Device-Media">Device Media</Chip>
                    <Chip size={"lg"} value="Device-Event">Device Event</Chip>
                </Chip.Group>
                <Stack spacing={25}>
                    {edges?.map((edge, i) => {
                        const node = edge.node

                        const meta: { name: string, description: string } = JSON.parse(safeTag(node, "Device-Token-Metadata", null))
                        const ipfsCid = safeTag(node, "IPFS-Add", null)

                        const deviceRecordType = safeTag(node, "Device-Record-Type", null)

                        return (
                            <Stack key={`Edge-${i}`}>
                                {deviceRecordType === "Device-Create" && (
                                    <SimpleGrid cols={2}>
                                        <Group sx={{fontFamily: "monospace"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Id:</Text>
                                            <Text inherit>{truncate(safeTag(node, "Device-Id", null), 24)}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Address:</Text>
                                            <Anchor href={`https://etherscan.io/address/${safeTag(node, "Device-Address", null)}`} inherit>{truncate(safeTag(node, "Device-Address", null) ?? "--", 24)}</Anchor>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Manufacturer:</Text>
                                            <Text inherit>{truncate(safeTag(node, "Device-Manufacturer", null) ?? "--", 24)}</Text>
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
                                )}
                                {deviceRecordType === "Device-Media" && (
                                    <SimpleGrid cols={2}>
                                        <Group sx={{fontFamily: "monospace"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Id:</Text>
                                            <Text inherit>{truncate(safeTag(node, "Device-Id", null), 24)}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Content Type:</Text>
                                            <Text inherit>{safeTag(node, "Content-Type", null)}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Name:</Text>
                                            <Text inherit>{meta?.name}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace"}} noWrap>
                                            <Text color={"dimmed"} inherit>Description:</Text>
                                            <Text lineClamp={1} inherit>{meta?.description !== "" ? meta?.description : "--"}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Minter:</Text>
                                            <Anchor href={`https://etherscan.io/address/${safeTag(node, "Device-Minter", null)}`} inherit>{truncate(safeTag(node, "Device-Minter", null) ?? "--", 24)}</Anchor>
                                        </Group>
                                    </SimpleGrid>
                                )}
                                {deviceRecordType === "Device-Event" && (
                                    <SimpleGrid cols={2}>

                                    </SimpleGrid>
                                )}
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