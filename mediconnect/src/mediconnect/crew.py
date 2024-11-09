from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from langchain_openai import ChatOpenAI

# Uncomment the following line to use an example of a custom tool
# from mediconnect.tools.custom_tool import MyCustomTool

# Check our tools documentations for more information on how to use them
# from crewai_tools import SerperDevTool

@CrewBase
class MediconnectCrew():
	"""Mediconnect crew"""

	@agent
	def report_explanation_agent(self) -> Agent:
		return Agent(
			config=self.agents_config['report_explanation_agent'],
			# tools=[MyCustomTool()], # Example of custom tool, loaded on the beginning of file
			verbose=True
		)

	@agent
	def medical_appointment_scheduler(self) -> Agent:
		return Agent(
			config=self.agents_config['medical_appointment_scheduler'],
			verbose=True
		)
	@agent
	def whatsapp_agent(self) -> Agent:
		return Agent(
			config=self.agents_config['whatsapp_agent'],
			verbose=True
		)
	
	
	

	@task
	def report_explanation_task(self) -> Task:
		return Task(
			config=self.tasks_config['report_explanation_task'],
		)

	@task
	def medical_appointment_scheduler_task(self) -> Task:
		return Task(
			config=self.tasks_config['medical_appointment_scheduler_task'],
			output_file='report.md'
		)
	
	@task
	def whatsapp_bot_task(self) -> Task:
		return Task(
			config=self.tasks_config['whatsapp_bot_task'],
			output_file='report.md'
		)

	@crew
	def crew(self) -> Crew:
		"""Creates the Mediconnect crew"""

		return Crew(
			agents=self.agents, # Automatically created by the @agent decorator
			tasks=self.tasks, # Automatically created by the @task decorator
			# process=Process.sequential,
			# manager_agent=self.manager,
			manager_llm=ChatOpenAI(temperature=0, model="gpt-4"),
			verbose=True,
			process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
		)



