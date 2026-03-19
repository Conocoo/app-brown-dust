import type { Skill } from '../../types/skill'
import { advancedBurn } from './advanced-burn'
import { advancedFatalStrike } from './advanced-fatal-strike'
import { shield } from './shield'
import { advancedFocusFire } from './advanced-focus-fire'
import { tauntImmune } from './taunt-immune'
import { advancedDispel } from './advanced-dispel'
import { buffBlock } from './buff-block'
import { atkWeaken } from './atk-weaken'
import { fatalStrikeRecovery } from './fatal-strike-recovery'
import { advancedTaunt } from './advanced-taunt'
import { advancedArmorStrike } from './advanced-armor-strike'
import { recovery } from './recovery'
import { advancedDotImmune } from './advanced-dot-immune'
import { fairAndSquare } from './fair-and-square'
import { advancedAtkUp } from './advanced-atk-up'
import { ccImmune } from './cc-immune'
import { statDebuffImmuneGrant } from './stat-debuff-immune-grant'
import { advancedStun } from './advanced-stun'
import { advancedPrecisionStrike } from './advanced-precision-strike'
import { critDamageSustainedIncrease } from './crit-damage-sustained-increase'
import { dispelSkill } from './dispel'
import { supremeFatalStrike } from './supreme-fatal-strike'
import { onKillAtkUp } from './on-kill-atk-up'
import { curseSkill } from './curse'
import { burn } from './burn'
import { harmfulEffectImmunity } from './harmful-effect-immunity'
import { advancedSelfdestructStun } from './advanced-selfdestruct-stun'
import { poison } from './poison'
import { decay } from './decay'
import { advancedPoisonCounter } from './advanced-poison-counter'
import { advancedShield } from './advanced-shield'
import { purifyDot } from './purify-dot'
import { sloanRecovery } from './sloan-recovery'
import { advancedGiantStrike } from './advanced-giant-strike'
import { giantStrikeRecovery } from './giant-strike-recovery'
import { critRateSustainedIncrease } from './crit-rate-sustained-increase'
import { regeneration } from './regeneration'
import { advancedCcPurify } from './advanced-cc-purify'
import { advancedRegenerationGrant } from './advanced-regeneration-grant'
import { reflexGrant } from './reflex-grant'
import { reflexDefUp } from './reflex-def-up'

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
register(fatalStrikeRecovery)
register(advancedTaunt)
register(advancedArmorStrike)
register(recovery)
register(advancedDotImmune)
register(fairAndSquare)
register(advancedAtkUp)
register(ccImmune)
register(statDebuffImmuneGrant)
register(advancedStun)
register(advancedPrecisionStrike)
register(critDamageSustainedIncrease)
register(dispelSkill)
register(supremeFatalStrike)
register(onKillAtkUp)
register(curseSkill)
register(burn)
register(harmfulEffectImmunity)
register(advancedSelfdestructStun)
register(poison)
register(decay)
register(advancedPoisonCounter)
register(advancedShield)
register(purifyDot)
register(sloanRecovery)
register(advancedGiantStrike)
register(giantStrikeRecovery)
register(critRateSustainedIncrease)
register(regeneration)
register(advancedCcPurify)
register(advancedRegenerationGrant)
register(reflexGrant)
register(reflexDefUp)

export function getSkillById(id: string): Skill | undefined {
  return skillMap.get(id)
}

export function getAllSkills(): Skill[] {
  return Array.from(skillMap.values())
}

