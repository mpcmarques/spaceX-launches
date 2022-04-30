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
