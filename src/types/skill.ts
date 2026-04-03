// 스킬 타입 정의
// skills.json (원본 스킬 템플릿) + mercenary-config.json (용병별 스킬) 기반

/** 14종 범위 패턴 (SkillActionType) */
export type RangePattern =
  | 'single'            // SAT_NORMAL (1)
  | 'piercing'          // SAT_PIERCING 전방 직선 (2)
  | 'cross'             // SAT_RANGE1 십자 (3)
  | 'square'            // SAT_RANGE2 사각형 (4)
  | 'vertical'          // SAT_SPREAD 세로 (5)
  | 'x_shape'           // SAT_RANGE_X X자 (6)
  | 'reverse_piercing'  // SAT_REVERSE_PIERCING 후방 직선 (7)
  | 'triangle'          // SAT_RANGE_TRIANGLE 삼각형 (8)
  | 'horizontal'        // SAT_SPREAD_HORIZONTAL 수평 (9)
  | 'wide'              // SAT_WIDE_SPREAD 광역 (10)
  | 'column'            // SAT_ONE_X_FULL_Y 1열 전체 (11)
  | 'fat_cross'         // SAT_FAT_CROSS 두꺼운 십자 (12)
  | 'chain'             // SAT_LINKED_CROSS_CHAINING 체이닝 (13)
  | 'range_piercing'    // SAT_RANGE_PIERCING 범위 관통 (14)

/** 9종 대상 검색 방식 (SkillTargetSearchType) */
export type SearchType =
  | 'enemy_front'         // STST_FIRST (1)
  | 'enemy_back'          // STST_LAST (2)
  | 'random'              // STST_RANDOM (3)
  | 'enemy_second'        // STST_SECOND (4)
  | 'next_ally'           // STST_SUPPORT_NEXT_SEQUENCE (5)
  | 'start_buff'          // STST_STARTBUFF (6)
  | 'self'                // STST_SELF_TARGET (7)
  | 'chaos'               // STST_INDUCING_CHAOS (8)
  | 'enemy_third'         // STST_THIRD (9)

/** 스킬 발동 타이밍 */
export type SkillTiming = 'before_attack' | 'after_attack' | 'passive'

export interface SkillBuffRef {
  buffCode: number
  subBuffCode?: number
}

/** skills.json 원본 스킬 템플릿 */
export interface SkillTemplate {
  code: number
  nameKr: string
  nameEn: string
  type: 'attack' | 'support'
  timing: 'attack' | SkillTiming
  rangePattern: RangePattern
  /** rangePattern 숫자값 (타겟팅 로직에서 사용) */
  rangePatternRaw: number
  rangeSize: number
  searchType: SearchType
  /** searchType 숫자값 (타겟팅 로직에서 사용) */
  searchTypeRaw: number
  repeatCount: number
  coolTimeCount: number
  /** 연결된 버프 참조 목록 */
  buffs: SkillBuffRef[]
}

/** mercenary-config.json의 스킬 효과 override */
export interface SkillEffectOverride {
  value?: number
  duration?: number
  atkScaling?: boolean
  spScaling?: boolean
  target?: string
  range?: RangePattern
}

/** 용병별 스킬 항목 (mercenary-config.json) */
export interface MercenarySkill {
  skillId: string
  effects: SkillEffectOverride[]
  timing: SkillTiming
}
