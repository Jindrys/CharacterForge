import type { UserModel } from "../generated/prisma/models/User";
import type { CharacterModel } from "../generated/prisma/models/Character";
import type { CharacterStatsModel } from "../generated/prisma/models/CharacterStats";
import type { EquipmentModel } from "../generated/prisma/models/Equipment";

export type CharacterWithRelations = CharacterModel & {
  stats: CharacterStatsModel | null;
  equipment: EquipmentModel[];
  owner: Pick<UserModel, "id" | "username" | "avatarUrl">;
};

export type PublicUser = Pick<
  UserModel,
  "id" | "username" | "avatarUrl" | "bio" | "createdAt"
>;

export type CharacterFormData = {
  name: string;
  race: string;
  class: string;
  level: number;
  backstory?: string;
  avatarUrl?: string;
  isPublic: boolean;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    maxHp: number;
    currentHp: number;
    armorClass: number;
    speed: number;
    initiative: number;
  };
  equipment: {
    name: string;
    type: string;
    description?: string;
    quantity: number;
  }[];
};
