import {AppShell, Container, Group, Header, Title} from "@mantine/core";

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
                    <Title order={2} weight={"bold"} sx={{fontFamily: "monospace"}}>Silent Cartographer</Title>
                </Group>
            </Container>
        </Header>
    )
}