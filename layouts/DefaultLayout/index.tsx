import {Anchor, AppShell, Container, Group, Header} from "@mantine/core";
import NextLink from "next/link";

export const DefaultLayout = ({children}) => {
    return (
        <AppShell sx={{overflow: "hidden"}} header={<DefaultHeader/>}>
            {children}
        </AppShell>
    )
}

const DefaultHeader = () => {
    return (
        <Header height={65}>
            <Container mx={"auto"} h={"100%"}>
                <Group align={"center"} sx={{height: "100%"}}>
                    <Anchor component={NextLink} href={"/"}  size={25} sx={{fontFamily: "monospace"}}>Silent Cartographer</Anchor>
                </Group>
            </Container>
        </Header>
    )
}