import type { Skill } from '../../types/skill'
import { magicBolt } from './magic-bolt'
import { bless1, bless2, bless3, bless4 } from './bless'
import { powerStrike1, powerStrike2, powerStrike3, powerStrike4 } from './power-strike'

const skillMap = new Map<string, Skill>()

function register(skill: Skill) {
  skillMap.set(skill.id, skill)
}

register(magicBolt)
register(bless1)
register(bless2)
register(bless3)
register(bless4)
register(powerStrike1)
register(powerStrike2)
register(powerStrike3)
register(powerStrike4)

export function getSkillById(id: string): Skill | undefined {
  return skillMap.get(id)
}

export function getAllSkills(): Skill[] {
  return Array.from(skillMap.values())
}
