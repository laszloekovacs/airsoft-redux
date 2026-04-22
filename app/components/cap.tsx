import "@cap.js/widget";
import { forwardRef, useEffect, useState } from 'react';


declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Define the tag and its expected attributes
            'cap-widget': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    'data-cap-api-endpoint'?: string;
                    // Add other custom attributes here
                },
                HTMLElement
            >;
        }
    }
}

export const Cap = forwardRef((props: { endpoint: string }, ref) => {
    const [isClient, setClient] = useState(false)

    useEffect(() => {
        setClient(true)
    }, [])

    return (isClient && <cap-widget ref={ref} data-cap-api-endpoint={props.endpoint} />)
})