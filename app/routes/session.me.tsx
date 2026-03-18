import { data, redirect } from "react-router";
import { auth } from "~/services/auth.server";
import type { Route } from "./+types/session.me";

export async function loader({ request }: Route.LoaderArgs) {
    // 1. Fetch the session/user from your auth service
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    // 2. If no user, send them away
    if (!session?.user) {
        throw redirect("/session/login");
    }

    // 3. Return the user data to the component
    return data({ user: session.user });
}

export default function DebugProfile({ loaderData }: Route.ComponentProps) {
    const { user } = loaderData;

    return (
        <div style={{ padding: "2rem", fontFamily: "monospace" }}>
            <h1 style={{ borderBottom: "1px solid #ccc" }}>🛠 Debug: User Data</h1>

            <section style={{ marginTop: "1rem" }}>
                <p><strong>Felhasználónév:</strong> {user.username || user.name}</p>
                <p><strong>E-mail:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
            </section>

            <hr />

            <h3>Raw JSON Payload:</h3>
            <pre style={{
                background: "#f4f4f4",
                padding: "1rem",
                borderRadius: "8px",
                overflowX: "auto",
                color: "black"
            }}>
                {JSON.stringify(user, null, 2)}
            </pre>

            <footer style={{ marginTop: "2rem" }}>
                <a href="/">← Vissza a főoldalra</a>
            </footer >
        </div>
    );
}