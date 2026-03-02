import type { Skill } from '../../types/skill'
import { advancedBurn } from './advanced-burn'
import { advancedFatalStrike } from './advanced-fatal-strike'
import { shield } from './shield'

const skillMap = new Map<string, Skill>()

export function register(skill: Skill) {
  skillMap.set(skill.id, skill)
}

register(advancedBurn)
register(advancedFatalStrike)
register(shield)

export function getSkillById(id: string): Skill | undefined {
  return skillMap.get(id)
}

export function getAllSkills(): Skill[] {
  return Array.from(skillMap.values())
}
