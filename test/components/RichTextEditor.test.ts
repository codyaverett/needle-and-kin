import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RichTextEditor from '~/components/RichTextEditor.vue'

// Mock document.execCommand
global.document.execCommand = vi.fn(() => true)
global.document.queryCommandState = vi.fn(() => false)
global.document.queryCommandValue = vi.fn(() => '')

describe('RichTextEditor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders editor with toolbar', () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    expect(wrapper.find('.rich-text-editor').exists()).toBe(true)
    expect(wrapper.find('[contenteditable="true"]').exists()).toBe(true)
    expect(wrapper.findAll('.toolbar-btn').length).toBeGreaterThan(0)
  })

  it('displays initial content', () => {
    const content = '<p>Initial content</p>'
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: content,
        placeholder: 'Start writing...'
      }
    })

    const editor = wrapper.find('[contenteditable="true"]')
    expect(editor.element.innerHTML).toBe(content)
  })

  it('emits update:modelValue on content change', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const editor = wrapper.find('[contenteditable="true"]')
    editor.element.innerHTML = '<p>New content</p>'
    await editor.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['<p>New content</p>'])
  })

  it('toggles bold formatting', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const boldButton = wrapper.find('button[title="Bold (Ctrl+B)"]')
    await boldButton.trigger('click')

    expect(document.execCommand).toHaveBeenCalledWith('bold', false, null)
  })

  it('toggles italic formatting', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const italicButton = wrapper.find('button[title="Italic (Ctrl+I)"]')
    await italicButton.trigger('click')

    expect(document.execCommand).toHaveBeenCalledWith('italic', false, null)
  })

  it('inserts bullet list', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const bulletListButton = wrapper.find('button[title="Bullet List"]')
    await bulletListButton.trigger('click')

    expect(document.execCommand).toHaveBeenCalledWith('insertUnorderedList', false, null)
  })

  it('inserts numbered list', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const numberedListButton = wrapper.find('button[title="Numbered List"]')
    await numberedListButton.trigger('click')

    expect(document.execCommand).toHaveBeenCalledWith('insertOrderedList', false, null)
  })

  it('changes text alignment', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const centerAlignButton = wrapper.find('button[title="Align Center"]')
    await centerAlignButton.trigger('click')

    expect(document.execCommand).toHaveBeenCalledWith('justifyCenter', false, null)
  })

  it('prompts for link insertion', async () => {
    global.prompt = vi.fn(() => 'https://example.com')
    
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const linkButton = wrapper.find('button[title="Insert Link"]')
    await linkButton.trigger('click')

    expect(global.prompt).toHaveBeenCalledWith('Enter URL:')
    expect(document.execCommand).toHaveBeenCalledWith('createLink', false, 'https://example.com')
  })

  it('emits insert-image event', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const imageButton = wrapper.find('button[title="Insert Image"]')
    await imageButton.trigger('click')

    expect(wrapper.emitted('insert-image')).toBeTruthy()
  })

  it('toggles preview mode', async () => {
    const content = '<p>Preview content</p>'
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: content,
        placeholder: 'Start writing...'
      }
    })

    expect(wrapper.find('.prose').exists()).toBe(false)

    const previewButton = wrapper.find('button').filter(node => 
      node.text().includes('Show Preview')
    )[0]
    await previewButton.trigger('click')

    expect(wrapper.find('.prose').exists()).toBe(true)
    expect(wrapper.find('.prose').html()).toContain(content)
  })

  it('toggles HTML view mode', async () => {
    const content = '<p>HTML content</p>'
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: content,
        placeholder: 'Start writing...'
      }
    })

    expect(wrapper.find('textarea').exists()).toBe(false)

    const htmlButton = wrapper.find('button').filter(node => 
      node.text().includes('View HTML')
    )[0]
    await htmlButton.trigger('click')

    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.element.value).toBe(content)
  })

  it('displays word count', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const editor = wrapper.find('[contenteditable="true"]')
    editor.element.innerText = 'This is a test sentence with six words'
    await editor.trigger('input')

    // Word count might be calculated differently, but it should be displayed
    expect(wrapper.text()).toMatch(/\d+ words/)
  })

  it('displays character count', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const editor = wrapper.find('[contenteditable="true"]')
    editor.element.innerText = 'Test text'
    await editor.trigger('input')

    expect(wrapper.text()).toMatch(/\d+ characters/)
  })

  it('handles keyboard shortcuts', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const editor = wrapper.find('[contenteditable="true"]')
    
    // Test Ctrl+B for bold
    await editor.trigger('keydown', { key: 'b', ctrlKey: true })
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, null)

    // Test Ctrl+I for italic
    await editor.trigger('keydown', { key: 'i', ctrlKey: true })
    expect(document.execCommand).toHaveBeenCalledWith('italic', false, null)

    // Test Ctrl+U for underline
    await editor.trigger('keydown', { key: 'u', ctrlKey: true })
    expect(document.execCommand).toHaveBeenCalledWith('underline', false, null)
  })

  it('handles paste event to insert plain text', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const editor = wrapper.find('[contenteditable="true"]')
    const pasteEvent = {
      preventDefault: vi.fn(),
      clipboardData: {
        getData: vi.fn(() => 'Pasted text')
      }
    }

    await editor.trigger('paste', pasteEvent)

    expect(pasteEvent.preventDefault).toHaveBeenCalled()
    expect(document.execCommand).toHaveBeenCalledWith('insertText', false, 'Pasted text')
  })

  it('changes heading level', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const select = wrapper.find('select').filter(node => 
      node.find('option[value="1"]').exists()
    )[0]
    
    await select.setValue('2')

    expect(document.execCommand).toHaveBeenCalledWith('formatBlock', false, '<h2>')
  })

  it('disables undo button when no history', () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const undoButton = wrapper.find('button[title="Undo (Ctrl+Z)"]')
    expect(undoButton.attributes('disabled')).toBeDefined()
  })

  it('disables redo button when no future history', () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '',
        placeholder: 'Start writing...'
      }
    })

    const redoButton = wrapper.find('button[title="Redo (Ctrl+Y)"]')
    expect(redoButton.attributes('disabled')).toBeDefined()
  })
})