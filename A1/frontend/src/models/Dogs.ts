import { DogOwners } from "./DogOwner";
import { Owners } from "./Owners";
import { Toys } from "./Toys";
import { Users } from "./User";

export interface Dogs{
    id?: number;
    name: string;
    breed: string;
    colour: string;
    is_healthy: boolean;
    date_of_birth: string;
    toys?: Toys[];
    owners?: DogOwners[];
    avg_price?:number;
    nr_of_owners?: number;
    users?: Users;
    username?: string;
}