import type { Skill } from '../../types/skill'
import type { MercenarySkillRef } from '../../types/mercenary'
import { advancedBurn } from './advanced-burn'
import { advancedFatalStrike } from './advanced-fatal-strike'
import { shield } from './shield'
import { advancedFocusFire } from './advanced-focus-fire'
import { tauntImmune } from './taunt-immune'
import { advancedDispel } from './advanced-dispel'
import { buffBlock } from './buff-block'
import { atkWeaken } from './atk-weaken'

const skillMap = new Map<string, Skill>()

export function register(skill: Skill) {
  skillMap.set(skill.id, skill)
}

register(advancedBurn)
register(advancedFatalStrike)
register(shield)
register(advancedFocusFire)
register(tauntImmune)
register(advancedDispel)
register(buffBlock)
register(atkWeaken)

export function getSkillById(id: string): Skill | undefined {
  return skillMap.get(id)
}

export function getAllSkills(): Skill[] {
  return Array.from(skillMap.values())
}

/** 용병의 스킬 참조를 실제 Skill[]로 변환 (오버라이드 병합) */
export function resolveSkills(refs: MercenarySkillRef[]): Skill[] {
  return refs
    .map((ref) => {
      const template = skillMap.get(ref.skillId)
      if (!template) return undefined
      if (!ref.effects || ref.effects.length === 0) return template
      return {
        ...template,
        effects: template.effects.map((eff, i) => {
          const override = ref.effects?.[i]
          return override ? { ...eff, ...override } : eff
        }),
      }
    })
    .filter((s): s is Skill => s !== undefined)
}
