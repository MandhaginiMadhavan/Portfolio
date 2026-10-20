import test from 'node:test'
import assert from 'node:assert/strict'
import { portfolioKnowledge } from './portfolioKnowledge.mjs'
import { buildInstructions } from './chatPolicy.mjs'

const expectedProjects = [
  'InsightForge',
  'TimeSync AI',
  'Persona Multiplier AI',
  'Wildfire Detection',
]

test('experience records match the approved titles, dates, and work categories', () => {
  assert.deepEqual(portfolioKnowledge.experience.map(({ category, dates, title, organisation, location }) => ({ category, dates, title, organisation, location })), [
    { category: 'Independent project development', dates: '2025–2026', title: 'Independent AI & Software Developer', organisation: 'Personal Technical Projects', location: 'United Kingdom' },
    { category: 'Employment', dates: 'May–Aug 2024', title: 'Clerical Marker', organisation: 'Cambridge University Press & Assessment', location: 'United Kingdom' },
    { category: 'Independent freelance work', dates: 'Jan–Aug 2023', title: 'Freelance AI & Data Science Developer', organisation: 'Independent Freelance Work', location: 'India' },
  ])
  assert.match(portfolioKnowledge.experience[0].details, /InsightForge, TimeSync AI and Persona Multiplier AI/)
  assert.match(portfolioKnowledge.experience[1].details, /strict deadlines/)
  assert.match(portfolioKnowledge.experience[2].details, /exploratory data analysis, model development and performance evaluation/)
})

test('every portfolio project has distinct summary, description, and technical detail', () => {
  assert.deepEqual(portfolioKnowledge.projects.map(({ name }) => name), expectedProjects)

  for (const project of portfolioKnowledge.projects) {
    assert.ok(project.summary.length > 40, `${project.name} needs a useful summary`)
    assert.ok(project.description.length > project.summary.length, `${project.name} needs a fuller description`)
    assert.ok(project.implementation.length >= 4, `${project.name} needs technical implementation details`)
    assert.match(project.contribution, /^She (developed|built|researched)/)
    assert.notEqual(project.description, project.summary)
  }
})

test('project descriptions retain verified project boundaries', () => {
  const byName = Object.fromEntries(portfolioKnowledge.projects.map((project) => [project.name, project]))

  assert.match(byName.InsightForge.description, /working prototype/i)
  assert.match(byName.InsightForge.description, /not an enterprise-ready multi-tenant product/i)
  assert.match(byName['TimeSync AI'].description, /deterministic Python Resolver and Critic/i)
  assert.match(byName['TimeSync AI'].description, /withheld rather than cut automatically/i)
  assert.match(byName['Persona Multiplier AI'].description, /one request to the selected provider/i)
  assert.match(byName['Wildfire Detection'].description, /five simulated clients/i)
  assert.match(byName['Wildfire Detection'].description, /not a production monitoring or emergency-alert system/i)
})

test('project summaries are concise and recruiter-friendly', () => {
  const byName = Object.fromEntries(portfolioKnowledge.projects.map((project) => [project.name, project]))
  assert.match(byName.InsightForge.summary, /organise business questions/i)
  assert.match(byName['TimeSync AI'].summary, /avoid inaccurate cuts/i)
  assert.match(byName['Persona Multiplier AI'].summary, /three personalised recruiter communication styles/i)
  assert.match(byName['Wildfire Detection'].summary, /MSc research project/i)
  assert.match(byName.InsightForge.contribution, /She developed InsightForge/)
  assert.match(byName['TimeSync AI'].contribution, /She developed TimeSync AI/)
  assert.match(byName['Persona Multiplier AI'].contribution, /She built Persona Multiplier AI/)
  assert.match(byName['Wildfire Detection'].contribution, /She researched Wildfire Detection/)
  for (const project of portfolioKnowledge.projects) {
    assert.doesNotMatch(project.summary, /Supervisor|FedAvg|Resolver|Critic|TF-IDF|FastAPI|Streamlit/i)
  }
})

test('Wildfire research result preserves the unresolved source discrepancy', () => {
  const wildfire = portfolioKnowledge.projects.find(({ name }) => name === 'Wildfire Detection')
  assert.match(wildfire.reportedResearchResults, /83% accuracy/i)
  assert.match(wildfire.reportedResearchResults, /85% global validation accuracy/i)
  assert.match(wildfire.reportedResearchResults, /unresolved source-reporting discrepancy/i)
  assert.match(wildfire.reportedResearchResults, /do not use either number in an ordinary project introduction/i)
})

test('chat instructions select project knowledge progressively for all four projects', () => {
  const instructions = buildInstructions()

  for (const name of expectedProjects) assert.match(instructions, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  assert.match(instructions, /use its summary for a simple introduction/i)
  assert.match(instructions, /its description for a natural moderate explanation or follow-up/i)
  assert.match(instructions, /implementation details for an explicitly technical request/i)
})
