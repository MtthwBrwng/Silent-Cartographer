import {ActionIcon, Anchor, AppShell, Container, Group, Header} from "@mantine/core";
import NextLink from "next/link";
import {BsGithub} from "react-icons/bs";

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
            <Container size={"md"} mx={"auto"} h={"100%"}>
                <Group align={"center"} position={"apart"} sx={{height: "100%"}}>
                    <Anchor component={NextLink} href={"/"} size={25} sx={{fontFamily: "monospace"}}>SiCa</Anchor>
                    <ActionIcon component={NextLink} href={"https://github.com/MtthwBrwng/silent-cartographer"} color={"grape"}><BsGithub color={"inherit"} size={25}/></ActionIcon>
                </Group>
            </Container>
        </Header>
    )
}