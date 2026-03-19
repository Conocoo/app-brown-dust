import type { MercenaryTemplate } from '../../../types/mercenary'

export const karin: MercenaryTemplate = {
  id: 'karin',
  name: '카린',
  type: 'attacker',
  star: 4,
  maxHp: 3837,
  atk: 1205,
  def: 0,
  emoji: '⚔️',
  imageId: '3515',
  critRate: 10,
  critDamage: 50,
  agility: 60,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'on_death_trigger', value: 0, duration: 24, debuffClass: 'stat_weaken' },
      { type: 'def_down', value: 30, duration: 24, debuffClass: 'stat_weaken' },
      { type: 'summon', value: 0, duration: 12, debuffClass: 'stat_weaken' },
      { type: 'atk_up', value: 100, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
