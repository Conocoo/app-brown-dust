import type { MercenaryTemplate } from '../../../types/mercenary'

export const wiggle: MercenaryTemplate = {
  id: 'wiggle',
  name: '위글',
  type: 'attacker',
  star: 3,
  maxHp: 726,
  atk: 4777,
  def: 0,
  emoji: '💥',
  imageId: 'char515icon',
  critRate: 5,
  critDamage: 50,
  agility: 0,
  attackTarget: 'enemy_front',
  attackRange: 'small_cross',
  selfDestruct: true,
  skills: [
    { skillId: 'advanced_selfdestruct_stun' },
    { skillId: 'harmful_effect_immunity' },
    { skillId: 'burn' },
  ],
}
