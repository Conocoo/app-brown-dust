import type { MercenaryTemplate } from '../../../types/mercenary'

export const angelica: MercenaryTemplate = {
  id: 'angelica',
  name: '안젤리카',
  type: 'attacker',
  star: 5,
  maxHp: 5207,
  atk: 20136,
  def: 35,
  emoji: '⚔️',
  imageId: '1795',
  critRate: 25,
  critDamage: 150,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'dot_31', value: 0.5, debuffClass: 'dot' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 70, duration: 999, buffType: 'shield', target: 'self' },
      { type: 'summon', value: 0, duration: 18, debuffClass: 'stat_weaken' },
    ],
  },
}
