import expect from 'expect'
import { addMenuItem, getMenuItems, getAuthorizedMenuItems, resetMenus } from '../lib/modules/menu'
describe('vulcan:lib/menu', () => {
    beforeEach(resetMenus)

    it('add a memu item in the default group', () => {
        const menuItem = {
            name: 'home',
            label: 'Home',
            path: '/home',
            groups: ['guests']

        }
        addMenuItem(menuItem)
        const defaultItems = getMenuItems()
        expect(defaultItems).toHaveLength(1)
        expect(defaultItems[0]).toMatchObject(menuItem)

    })
    it('add a menu item in a specific group', () => {
        const menuItem = {
            name: 'home',
            label: 'Home',
            path: '/home',
            groups: ['admin'],
            menuGroup: 'admin'
        }
        addMenuItem(menuItem)
        const defaultItems = getMenuItems()
        const adminItems = getMenuItems('admin')
        expect(defaultItems).toHaveLength(0)
        expect(adminItems[0]).toMatchObject(menuItem)
    })
    it('filter out non authorized menu items', () => {
        const allowedMenuItem = {
            name: 'home',
            label: 'Home',
            path: '/home',
            // no groups is equivalent to guests
        }
        const nonAllowedMenuItem = {
            name: 'private',
            label: 'private',
            path: '/private',
            groups: ['members'],
        }
        addMenuItem(allowedMenuItem)
        addMenuItem(nonAllowedMenuItem)
        const defaultItems = getAuthorizedMenuItems(null)
        expect(defaultItems).toHaveLength(1)
        expect(defaultItems[0]).toMatchObject(allowedMenuItem)

    })
})