/**
 * 小程序本地缓存工具类（带过期时间）
 */

type StorageValue = any;

interface StorageWrapper {
  value: StorageValue;
  expire: number; // 到期时间戳（毫秒），0 表示不过期
}

const storage = {
  /**
   * 设置缓存
   * @param key 缓存键
   * @param value 缓存值
   * @param expireSeconds 过期时间（秒），默认 0 表示永久
   */
  set(key: string, value: StorageValue, expireSeconds = 0): void {
    try {
      const data: StorageWrapper = {
        value,
        expire: expireSeconds > 0 ? Date.now() + expireSeconds * 1000 : 0
      };
      wx.setStorageSync(key, data);
    } catch (error) {
      console.error("缓存设置失败：", error);
    }
  },

  /**
   * 获取缓存
   * @param key 缓存键
   * @param defaultValue 默认值（可选）
   * @returns 缓存值或默认值
   */
  get<T = StorageValue>(key: string, defaultValue: T | null = null): T | null {
    try {
      const data: StorageWrapper | null = wx.getStorageSync(key);

      // 未存储任何内容
      if (!data) return defaultValue;

      const { value, expire } = data;

      // 无过期时间
      if (!expire || expire === 0) {
        return value as T;
      }

      // 已过期
      if (Date.now() > expire) {
        wx.removeStorageSync(key);
        return defaultValue;
      }

      return value as T;
    } catch (error) {
      console.error("缓存读取失败：", error);
      return defaultValue;
    }
  },

  /**
   * 判断缓存是否存在且未过期
   * @param key 缓存键
   * @returns true 表示存在，false 表示不存在
   */
  has(key: string): boolean {
    try {
      const data: StorageWrapper | null = wx.getStorageSync(key);
      if (!data) return false;

      const { expire } = data;

      if (expire && expire > 0 && Date.now() > expire) {
        wx.removeStorageSync(key);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * 删除某个缓存项
   */
  remove(key: string): void {
    try {
      wx.removeStorageSync(key);
    } catch (error) {
      console.error("缓存删除失败：", error);
    }
  },

  /**
   * 清空所有缓存
   */
  clear(): void {
    try {
      wx.clearStorageSync();
    } catch (error) {
      console.error("清空缓存失败：", error);
    }
  }
};

export default storage;
