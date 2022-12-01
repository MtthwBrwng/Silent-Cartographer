import {Anchor, Button, Center, Chip, Container, Divider, Group, Loader, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import {useListTransactionsQuery} from "../graphql/generated";
import React, {useState} from "react";
import {DefaultLayout} from "../layouts/DefaultLayout";
import {useCursorPagination} from "../hooks/use-cursor-pagination";
import {useMediaQuery} from "@mantine/hooks";

export default function Home() {
    const {onNextPage, onPreviousPage, nextToken, hasPrev} = useCursorPagination()
    const [deviceRecordTypeFilter, setDeviceRecordTypeFilter] = useState<string[] | undefined>(["Device-Create", "Device-Media", "Device-Event"])
    const matches = useMediaQuery('(max-width: 900px)', false);

    const {status, data, error, isLoading, isRefetching} = useListTransactionsQuery({
        tagFilter: [
            {name: "App-Name", values: ["ERS"]},
            {name: "Device-Record-Type", values: deviceRecordTypeFilter},
        ],
        after: nextToken,
        first: 25,
    }, {keepPreviousData: true, queryKey: ["chips", nextToken]})

    if (isLoading && !isRefetching) {
        return (
            <Center py={50}>
                <Loader variant={"dots"} size={"lg"}/>
            </Center>
        )
    }

    const edges = data?.transactions?.edges
    const cursor = edges[edges.length - 1]?.cursor
    const hasNextPage = data?.transactions?.pageInfo?.hasNextPage

    return (
        <Container size={"md"} sx={{overflow: "hidden"}}>
            <Stack spacing={10}>
                <Group align={"center"} position={"apart"} noWrap>
                    <Title order={matches ? 2 : 1} sx={{fontFamily: "monospace", whiteSpace: "nowrap"}}>SiLo Chips</Title>
                    <Group spacing={10} noWrap>
                        <Button size={"xs"} radius={"lg"} onClick={() => onPreviousPage()} disabled={!hasPrev}>Back</Button>
                        <Button size={"xs"} radius={"lg"} onClick={() => onNextPage(cursor)} loading={isRefetching}>Next</Button>
                    </Group>
                </Group>
                <Chip.Group position={matches ? "center" : "apart"} pb={10} value={deviceRecordTypeFilter} onChange={(value => setDeviceRecordTypeFilter(value))} multiple>
                    <Chip size={"md"} value="Device-Create">Device Create</Chip>
                    <Chip size={"md"} value="Device-Media">Device Media</Chip>
                    <Chip size={"md"} value="Device-Event">Device Event</Chip>
                </Chip.Group>
                <Stack spacing={25}>
                    {edges?.map((edge, i) => {
                        const node = edge.node
                        const meta: { name: string, description: string } = JSON.parse(safeTag(node, "Device-Token-Metadata", null))

                        let tags = {
                            appName: safeTag(node, "App-Name", null),
                            appVersion: safeTag(node, "App-Version", null),
                            contentType: safeTag(node, "Content-Type", null),
                            deviceRecordType: safeTag(node, "Device-Record-Type", null),
                            deviceId: safeTag(node, "Device-Id", null),
                            deviceEventScanner: safeTag(node, "Device-Event-Scanner", null),
                            deviceAddress: safeTag(node, "Device-Address", null),
                            deviceManufacture: safeTag(node, "Device-Manufacturer", null),
                            deviceModel: safeTag(node, "Device-Model", null),
                            deviceMerkelRoot: safeTag(node, "Device-Merkel-Root", null),
                            deviceRegistry: safeTag(node, "Device-Registry", null),
                            deviceSignature: safeTag(node, "Device-Signature", null),
                            deviceTokenMetadata: safeTag(node, "Device-Token-Metadata", null),
                            deviceMinter: safeTag(node, "Device-Minter", null),
                            deviceMinterSignature: safeTag(node, "Device-Minter-Signature", null),
                            deviceMinterChainId: safeTag(node, "Device-Minter-Chain-Id", null),
                            ipfsAdd: safeTag(node, "IPFS-Add", null),
                        }

                        return (
                            <Stack spacing={25} key={`Edge-${i}`}>
                                {tags?.deviceRecordType === "Device-Create" && (
                                    <SimpleGrid breakpoints={[{cols: 1, maxWidth: "sm"}]} cols={2}>
                                        <Group sx={{fontFamily: "monospace"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Id:</Text>
                                            <Text inherit>{truncate(tags?.deviceId, 24)}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Address:</Text>
                                            {tags?.deviceAddress ? (<Anchor href={`https://etherscan.io/address/${tags?.deviceAddress}`} inherit>{truncate(tags?.deviceAddress, 24)}</Anchor>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Manufacturer:</Text>
                                            {tags?.deviceManufacture ? (<Text inherit>{tags?.deviceManufacture}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Model:</Text>
                                            {tags?.deviceModel ? (<Text inherit>{tags?.deviceModel}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Merkel Root:</Text>
                                            {tags?.deviceMerkelRoot ? (<Text inherit>{tags?.deviceMerkelRoot}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Registry:</Text>
                                            {tags?.deviceRegistry ? (<Text inherit>{tags?.deviceRegistry}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Content Type:</Text>
                                            {tags?.contentType ? (<Text inherit>{tags?.contentType}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Record Type:</Text>
                                            {tags?.deviceRecordType ? (<Text inherit>{tags?.deviceRecordType}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
                                    </SimpleGrid>
                                )}
                                {tags?.deviceRecordType === "Device-Media" && (
                                    <SimpleGrid breakpoints={[{cols: 1, maxWidth: "sm"}]} cols={2}>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Id:</Text>
                                            <Text inherit>{truncate(tags?.deviceId, 24)}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Name:</Text>
                                            <Text lineClamp={1} inherit>{meta?.name}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace"}} noWrap>
                                            <Text color={"dimmed"} inherit>Description:</Text>
                                            <Text lineClamp={1} inherit>{meta?.description !== "" ? meta?.description : "--"}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Minter:</Text>
                                            {tags?.deviceMinter ? (<Anchor href={`https://etherscan.io/address/${tags?.deviceMinter}`} inherit>{truncate(tags?.deviceMinter, 24)}</Anchor>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Signature:</Text>
                                            <Text inherit>{truncate(tags?.deviceSignature, 24)}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Minter Chain Id:</Text>
                                            <Text inherit>{tags?.deviceMinterChainId}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Content Type:</Text>
                                            {tags?.contentType ? (<Text inherit>{tags?.contentType}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Record Type:</Text>
                                            {tags?.deviceRecordType ? (<Text inherit>{tags?.deviceRecordType}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
                                    </SimpleGrid>
                                )}
                                {tags?.deviceRecordType === "Device-Event" && (
                                    <SimpleGrid breakpoints={[{cols: 1, maxWidth: "sm"}]} cols={2}>
                                        <Group sx={{fontFamily: "monospace"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Id:</Text>
                                            <Text inherit>{truncate(tags?.deviceId, 24)}</Text>
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Address:</Text>
                                            {tags?.deviceAddress ? (<Anchor href={`https://etherscan.io/address/${tags?.deviceAddress}`} inherit>{truncate(tags?.deviceAddress, 24)}</Anchor>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Content Type:</Text>
                                            {tags?.contentType ? (<Text inherit>{tags?.contentType}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
                                        <Group sx={{fontFamily: "monospace", whiteSpace: "nowrap"}} noWrap>
                                            <Text color={"dimmed"} inherit>Device Record Type:</Text>
                                            {tags?.deviceRecordType ? (<Text inherit>{tags?.deviceRecordType}</Text>) : (<Text inherit>--</Text>)}
                                        </Group>
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