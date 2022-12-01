import {useState} from "react";

export const useCursorPagination = () => {
    const [nextTokenValue, setNextTokenValue] = useState<string | null | undefined>()
    const [previousTokenValues, setPreviousTokenValues] = useState<(string | null | undefined)[]>([])

    const hasPrev = Boolean(previousTokenValues?.length)

    const handleOnNextPage = async (cursor: string) => {
        await setPreviousTokenValues((prev) => [...prev, nextTokenValue])
        await setNextTokenValue(cursor)
    }

    const handleOnPreviousPage = async () => {
        const previousNextToken = previousTokenValues.pop()
        await setNextTokenValue(previousNextToken)
        await setPreviousTokenValues([...previousTokenValues])
    }

    return {
        onNextPage: handleOnNextPage,
        onPreviousPage: handleOnPreviousPage,
        nextToken: nextTokenValue,
        hasPrev
    }
}