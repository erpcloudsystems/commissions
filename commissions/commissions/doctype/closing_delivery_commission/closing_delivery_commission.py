# -*- coding: utf-8 -*-
# Copyright (c) 2019, Tech Station and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ClosingDeliveryCommission(Document):
	def on_submit(self):
		for d in self.transaction:
			sv = frappe.get_doc("Sales Order",d.transaction_number)
			sv.is_cdc = 1
			sv.save()

		if not self.commission_balance:
			so = frappe.get_doc({
			"doctype": "Commission Balance",
			"type": self.type,
			"beneficiary": self.beneficiary,
			"balance" : self.closing_balance
			})
			so.insert(ignore_permissions=True)
			so.save()
			frappe.msgprint("Commission Balance Created")

		if self.commission_balance:
			doc_or = frappe.get_doc("Commission Balance", self.commission_balance)
			doc_or.balance += self.closing_balance
			doc_or.save()

@frappe.whitelist(allow_guest=True)
def getCB(type,beneficiary):
	mt = frappe.db.sql("""select name from `tabCommission Balance` where type = %s and beneficiary = %s;""",(type,beneficiary))
	return mt[0][0] if mt else ""


@frappe.whitelist(allow_guest=True)
def getBEN():
	or_setting = frappe.db.sql("""select value from `tabSingles` where 
                               doctype = 'Commission Setting' and field = 'contact_the_customer_to_a_seller';""")

	return or_setting[0][0] if or_setting else 0.0


@frappe.whitelist(allow_guest=True)
def insert_data(from_date,to_date,beneficiary,type):
	query="select payment_method,transaction_date,name,grand_total,owner from `tabSales Order` where status = 'Completed' and is_cdc = 0 and shipping_source = '"+str(beneficiary)+"' and shipping_by = '"+str(type)+"' and transaction_date between '"+str(from_date)+"' and '"+str(to_date)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:
		payment_method,transaction_date,name,grand_total,owner = i["payment_method"],i["transaction_date"],i["name"],i["grand_total"],i["owner"]
		li.append([payment_method,transaction_date,name,grand_total,owner])
	return li


@frappe.whitelist(allow_guest=True)
def getCODorder(type,beneficiary,from_date,to_date):
	mt = frappe.db.sql("""select count(name) from `tabSales Order` where is_cdc = 0 and docstatus = 1 and 
			status = "Completed" and (payment_method = "Cash On Delivery" or payment_method = "Bank Instalment")
			and shipping_by = %s and shipping_source = %s and 
			transaction_date between %s and %s;""",(type,beneficiary,from_date,to_date),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getCANOrder(type,beneficiary,from_date,to_date):
	mt = frappe.db.sql("""select count(name) from `tabSales Order` where docstatus = 2 and 
			shipping_by = %s and shipping_source = %s and 
                        transaction_date between %s and %s;""",(type,beneficiary,from_date,to_date),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getPaidOrder(type,beneficiary,from_date,to_date):
	mt = frappe.db.sql("""select count(name) from `tabSales Order` where is_cdc = 0 and docstatus = 1 and 
                        status = "Completed" and payment_method = "Paid" and shipping_by = %s and shipping_source = %s and 
                        transaction_date between %s and %s;""",(type,beneficiary,from_date,to_date),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getDELDC(beneficiary):
	mt = frappe.db.sql("""select delivery_commission from `tabDelegate` where name = %s;""",(beneficiary),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getDELCC(beneficiary):
	mt = frappe.db.sql("""select collection_commission from `tabDelegate` where name = %s;""",(beneficiary),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getSHPDC(beneficiary):
	mt = frappe.db.sql("""select delivery_commission from `tabShipping Company` where name = %s;""",(beneficiary),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getSHPCC(beneficiary):
	mt = frappe.db.sql("""select collection_commission from `tabShipping Company` where name = %s;""",(beneficiary),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getDELDelayOrder(type,beneficiary,from_date,to_date):
	mt = frappe.db.sql("""select count(name) from `tabDelivery Orders By Delegates` where docstatus = 1 and delivery_status = "Delayed" and
                        shipping_by = %s and source = %s and 
                        delivery_note between %s and %s;""",(type,beneficiary,from_date,to_date),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getDELRejOrder(type,beneficiary,from_date,to_date):
	mt = frappe.db.sql("""select count(name) from `tabDelivery Orders By Delegates` where docstatus = 1 and delivery_status = "Rejected" and 
                        shipping_by = %s and source = %s and 
                        delivery_note between %s and %s;""",(type,beneficiary,from_date,to_date),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getSHPDelayOrder(type,beneficiary,from_date,to_date):
	mt = frappe.db.sql("""select count(name) from `tabDelivery Orders By Shipping Companies` where docstatus = 1 and delivery_status = "Delayed" and
                        shipping_by = %s and source = %s and 
                        delivery_note between %s and %s;""",(type,beneficiary,from_date,to_date),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getSHPRejOrder(type,beneficiary,from_date,to_date):
	mt = frappe.db.sql("""select count(name) from `tabDelivery Orders By Shipping Companies` where docstatus = 1 and delivery_status = "Rejected" and
                        shipping_by = %s and source = %s and 
                        delivery_note between %s and %s;""",(type,beneficiary,from_date,to_date),as_list=1)
	return mt[0][0] if mt else 0.0

