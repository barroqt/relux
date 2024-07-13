import { useBalance } from 'wagmi'

type Props = {
    address: `0x${string}` | undefined;
}

export default function Balance(props: Props) {
    if (!props.address) return <div>Not connected</div>

    const { data, isError, isLoading } = useBalance({
        address: props.address,
    })

    if (isLoading) return <div>Fetching balance…</div>
    if (isError) return <div>Error fetching balance</div>
    return (
        <div>
            Balance: {data?.formatted} {data?.symbol}
        </div>
    )
}