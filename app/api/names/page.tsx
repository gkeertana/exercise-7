import {JSX} from "react";

export default async function ServerComponentUserList(): Promise<JSX.Element> {
    const url = "https://www.usemodernfullstack.dev/api/v1/users";
    let data: ResponseType[] | [] = [];
    let names: ResponseType[] | [];
    try {
        const response = await fetch(url, {cache: "force-cache"});
        data = (await response.json()) as ResponseType[];
    } catch (err) {
        throw new Error("Failed to fetch data");
    }
    names = data.map((item) => {
        return {id: item.id, name: item.name};
    });

    return (
        <ul>
            {names.map((item) => (
                <li key="{item.id}">{item.name}</li>
            ))}
        </ul>
    );
}