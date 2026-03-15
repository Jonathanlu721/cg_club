export type Rating = '特優' | '優等' | '甲等' | '乙等' | '丙等';
export type ClubType = '學術' | '體育' | '音樂' | '技藝' | '服務' | '康樂';

export interface Club {
  id: string;
  name: string;
  rating: Rating;
  type: ClubType;
  brief: string;
  description: string;
  membersRange: string;
  fee: number;
  cadres: string[];
  classContent: string;
  activities: string[];
}
