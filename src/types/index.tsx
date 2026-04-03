export interface Filter {
	success?: boolean;
	upcoming?: boolean;
	date_utc?: {
		$gte?: string;
		$lte?: string;
	};
}

export interface Launch {
	name: string;
	date_utc: string;
	upcoming?: boolean;
	id: string;
	rocket: { name: string; flickr_images: Array<string> };
	success?: boolean;
}

export interface LaunchDetail extends Launch {
	flight_number?: number;
	details?: string | null;
	launchpad?: {
		name: string;
		full_name: string;
		locality: string;
		region: string;
	};
	payloads?: Array<{
		id: string;
		name: string;
		type: string;
		mass_kg?: number | null;
		orbit?: string | null;
	}>;
	links?: {
		patch?: { small?: string | null; large?: string | null };
		webcast?: string | null;
		article?: string | null;
		wikipedia?: string | null;
	};
	failures?: Array<{
		time?: number | null;
		altitude?: number | null;
		reason: string;
	}>;
	crew?: Array<string>;
}
