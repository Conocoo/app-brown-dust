import type { MercenaryTemplate } from '../../../types/mercenary'

export const ventana: MercenaryTemplate = {
  id: 'ventana',
  name: '벤타나',
  type: 'attacker',
  star: 5,
  maxHp: 4023,
  atk: 2733,
  def: 5,
  emoji: '⚔️',
  imageId: '2785',
  critRate: 75,
  critDamage: 75,
  agility: 45,
  skill: {
    timing: 'before_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'on_death_trigger', value: 0, duration: 1, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'direct_damage', value: 0.5, debuffClass: 'stat_weaken' },
      { type: 'damage_limit', value: 0.31, duration: 1, buffType: 'special', target: 'self' },
      { type: 'equipment', value: 0, duration: 1, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
