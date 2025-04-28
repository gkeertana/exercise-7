import {ApolloServer} from "@apollo/server";
import {startServerAndCreateNextHandler} from "@as-integrations/next";
import {resolvers} from "../../graphql/resolvers";
import {typeDefs} from "../../graphql/schema";
import {NextResponse} from "next/server";
import dbConnect from "@/middleware/db-connect";
import { NextRequest } from "next/server";


//@ts-ignore
const server = new ApolloServer({
    resolvers,
    typeDefs
});

const handler = startServerAndCreateNextHandler(server);

async function connectDB(req: NextRequest) {
    await dbConnect();
    return handler(req);
}

async function allowCors (req: NextRequest) {
        const response = await connectDB(req);
        if(req.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "true",
            },
        });
    }
    
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
}

export async function POST(req: NextRequest) {
    return allowCors(req);
}

export async function GET(req: NextRequest) {
    return allowCors(req);
}


/*import {ApolloServer} from "@apollo/server";
import {startServerAndCreateNextHandler} from "@as-integrations/next";
import {resolvers} from "../../graphql/resolvers";
import {typeDefs} from "../../graphql/schema";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../middleware/db-connect";
//@ts-ignore
const server = new ApolloServer({
    resolvers,
    typeDefs
});

const handler = startServerAndCreateNextHandler(server);

const allowCors = (fn: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        res.setHeader("Allow", "POST");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        if (req.method === "OPTIONS") {
            res.status(200).end();
        }
        return await fn(req, res);
    };

const connectDB = (fn: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        await dbConnect();
        return await fn(req, res);
    };

export default connectDB(allowCors(handler));
*/


