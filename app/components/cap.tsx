import "@cap.js/widget"
import { forwardRef } from "react"


export const Cap = forwardRef((props: { endpoint: string, apikey: string }, ref) => {

    return <cap-widget ref={ref} data-cap-api-endpoint={`${props.endpoint}/${props.apikey}`} />
})