# -*- coding: utf-8 -*-
# Copyright (c) 2019, Tech Station and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import msgprint
from frappe.model.document import Document

class ClosingSalesCommission(Document):
	def on_submit(self):
		self.created_by = self.owner
		self.confirmed_by = frappe.session.user

		if self.type == "Sales Person Master" or self.type == "Sales Partner Master":
			doc_or = frappe.get_doc("Commission Balance", self.commission_balance)
			doc_or.balance += self.closing_balance
			doc_or.save()

		if self.type == "Sales Team Master":
			doc_or = frappe.get_doc("Commission Balance", self.commission_balance)
			doc_or.balance += self.closing_balance
			doc_or.save()
			for d in self.cb_sales_team:
				doc_or = frappe.get_doc("Balance Detail", d.name1)
				doc_or.total_commission += self.cb_value
				doc_or.balance = doc_or.total_commission - doc_or.paid
				doc_or.save()


		for d in self.transaction:
			sv = frappe.get_doc("Sales Invoice",d.transaction_number)
			sv.calculated = 1
			sv.submit()

@frappe.whitelist(allow_guest=True)
def insert_data(from_date,to_date,beneficiary,type):
	query="select mode_of_payment,posting_date,name,grand_total,owner from `tabSales Invoice` where calculated = 0 and status = 'Paid' and beneficiary = '"+str(beneficiary)+"' and type = '"+str(type)+"' and posting_date between '"+str(from_date)+"' and '"+str(to_date)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:
		mode_of_payment,posting_date,name,grand_total,owner = i["mode_of_payment"],i["posting_date"],i["name"],i["grand_total"],i["owner"]
		li.append([mode_of_payment,posting_date,name,grand_total,owner])
	return li

@frappe.whitelist(allow_guest=True)
def insert_data_DN(from_date,to_date,beneficiary,type):
	query="select mode_of_payment,posting_date,name,grand_total,owner from `tabSales Invoice` where calculated = 0 and docstatus = 1 and delivery = 'Delivered' and beneficiary = '"+str(beneficiary)+"' and type = '"+str(type)+"' and posting_date between '"+str(from_date)+"' and '"+str(to_date)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:
		mode_of_payment,posting_date,name,grand_total,owner = i["mode_of_payment"],i["posting_date"],i["name"],i["grand_total"],i["owner"]
		li.append([mode_of_payment,posting_date,name,grand_total,owner])
	return li


def updateMOP(doc,method):
	for d in doc.references:
		if d.reference_doctype == "Sales Invoice":
			sv = frappe.get_doc(d.reference_doctype,d.reference_name)
			sv.mode_of_payment = doc.mode_of_payment
			sv.save()

@frappe.whitelist(allow_guest=True)
def getQTY(from_date,to_date,beneficiary,type):
	stock = frappe.db.sql("""select sum(grand_total) from `tabSales Invoice` where calculated = 0 and (status = 'Unpaid' or status = 'Overdue') 
			and (posting_date between %s and %s) and beneficiary = %s and type = %s;""",(from_date,to_date,beneficiary,type))
	return stock[0][0] if stock else 0.0


@frappe.whitelist(allow_guest=True)
def getMT(commission_template):
	mt = frappe.db.sql("""select monthly_target,commission_rate,minimum_monthly_target,commission_in_less_then_monthly_target 
				from `tabCommission Template` where name = %s;""",(commission_template),as_list=1)
	return mt

@frappe.whitelist(allow_guest=True)
def getCOMM(commission_template):
	mt = frappe.db.sql("""select commission_rate from `tabCommission Template` where name = %s;""",(commission_template))
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getCB(type,beneficiary):
	mt = frappe.db.sql("""select name from `tabCommission Balance` where type = %s and beneficiary = %s;""",(type,beneficiary))
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getCOMM_LS(commission_template):
	mt = frappe.db.sql("""select commission_in_less_then_monthly_target from `tabCommission Template` where name = %s;""",(commission_template))
	return mt[0][0] if mt else 0.0


@frappe.whitelist(allow_guest=True)
def getCPB():
	or_setting = frappe.db.sql("""select IF(value='1', "1", "0") from `tabSingles` where 
				doctype = 'Commission Setting' and field = 'calculate_only_the_paid_bills';""")

	return or_setting[0][0] if or_setting else 0.0

@frappe.whitelist(allow_guest=True)
def getCDB():
	or_setting = frappe.db.sql("""select IF(value='1', "1", "0") from `tabSingles` where 
                                doctype = 'Commission Setting' and field = 'calculate_only_the_delivered_invoices';""")

	return or_setting[0][0] if or_setting else 0.0

@frappe.whitelist(allow_guest=True)
def getPaid(from_date,to_date,beneficiary,type):
	stock = frappe.db.sql("""select sum(grand_total) from `tabSales Invoice` where calculated = 0 and (status = 'Paid') 
                        and (posting_date between %s and %s) and beneficiary = %s and type = %s;""",(from_date,to_date,beneficiary,type))
	return stock[0][0] if stock else 0.0

@frappe.whitelist(allow_guest=True)
def getDeliverd(from_date,to_date,beneficiary,type):
	stock = frappe.db.sql("""select sum(grand_total) from `tabSales Invoice` where calculated = 0 and docstatus = 1 and delivery = 'Delivered'
                        and (posting_date between %s and %s) and beneficiary = %s and type = %s;""",(from_date,to_date,beneficiary,type))
	return stock[0][0] if stock else 0.0

@frappe.whitelist(allow_guest=True)
def updateDNSI(doc,method):
	for d in doc.items:
		if d.against_sales_invoice:
			doc_or = frappe.get_doc("Sales Invoice", d.against_sales_invoice)
			doc_or.delivery = "Delivered"
			doc_or.save()
