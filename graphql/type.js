import { gql } from "@apollo/client";

export const typeUser = gql`
	extend type User {

	}

`;

export const typeDefs = `
	type User {
		id
		fullname
		phone
		gender
		birthday
		token
		status
		is_actived
		is_deleted
	}

	type Postals {}
`;
