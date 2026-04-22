import "@cap.js/widget"
import { useEffect, useState } from "react"

export const Cap = (props: {
    endpoint: string
    onError?: (event: { detail: { error: string } }) => { message: string }
    onSolve?: (event: { detail: { token: string } }) => { token: string }
}): React.ReactNode => {
    const [isClient, setClient] = useState(false)

    useEffect(() => {
        setClient(true)
    }, [])

    return (isClient && <cap-widget data-cap-api-endpoint={props.endpoint}
        data-cap-hidden-field-name="captoken"
        onsolve={props?.onSolve}
        onerror={props?.onError} />)
}
