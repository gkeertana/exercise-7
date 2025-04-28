/*import {db} from "./data";

declare interface WeatherInterface {
    zip: string;
    weather: string;
    tempC: string;
    tempF: string;
    friends: string[];
}

export const resolvers = {
    Query: {
        weather: async (_: any, param: WeatherInterface) => {
            return [db.find((item) => item.zip === param.zip)];
        }
    },
    Mutation: {
        weather: async (_: any, param: {data: WeatherInterface}) => {
            return [db.find((item) => item.zip === param.data.zip)];
        }
    }
};
*/

/*
import {WeatherInterface} from "../../mongoose/weather/interface";
import {findByZip, updateByZip} from "../../mongoose/weather/services";

console.log("resolvers.ts");
export const resolvers = {
    Query: {
        weather: async (_: any, param: WeatherInterface) => {
            let data = await findByZip(param.zip);
            return [data];
        },
    },
    Mutation: {
        weather: async (_: any, param: {data: WeatherInterface}) => {
            await updateByZip(param.data.zip, param.data);
            let data = await findByZip(param.data.zip);
            return [data];
        },
    }
}; */

import { WeatherInterface } from "../../mongoose/weather/interface";
import { findByZip, updateByZip } from "../../mongoose/weather/services";
import { ApolloError } from "apollo-server-errors";

export const resolvers = {
  Query: {
    weather: async (
      _parent: any,
      args: { zip?: string }
    ): Promise<WeatherInterface[]> => {
      if (!args.zip) {
        throw new ApolloError("Missing ZIP argument");
      }
      const data = await findByZip(args.zip);
      // findByZip returns Array<WeatherInterface> or [] on error
      return data!;
    },
  },

  Mutation: {
    weather: async (
      _parent: any,
      args: { data: WeatherInterface }
    ): Promise<WeatherInterface[]> => {
      const { zip, ...rest } = args.data;
      if (!zip) {
        throw new ApolloError("Missing ZIP in input");
      }

      const ok = await updateByZip(zip, args.data);
      if (!ok) {
        throw new ApolloError(`Failed to update document for ZIP ${zip}`);
      }

      const updated = await findByZip(zip);
      return updated!;
    },
  },
};
