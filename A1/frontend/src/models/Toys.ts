import { Dogs } from "./Dogs";
import { Users } from "./User";

export interface Toys
{
    id?: number;
    name: string;
    dog: Dogs;
    material: string;
    colour: string;
    price: number;
    descriptions: string;
    nr_of_toys?: number;
    users?: Users;
    username?: string;
}