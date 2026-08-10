export interface HymnSection {
  type: 'verse' | 'refrain' | string;
  number: number | null;
  label: string;
  lines: string[];
  reuse_previous?: boolean;
}

export interface HymnMetadata {
  lyricist_author_translator?: string;
  composer?: string;
  reference?: string;
  other?: string[];
}

export interface HymnRecord {
  id: string;
  number: number;
  title: string;
  language: string;
  language_name: string;
  source_file: string;
  metadata: HymnMetadata;
  sections: HymnSection[];
}

export interface HymnPack {
  schema: string;
  language: {
    code: string;
    name: string;
  };
  source: string;
  generated_at: string;
  hymn_count: number;
  hymns: HymnRecord[];
}
