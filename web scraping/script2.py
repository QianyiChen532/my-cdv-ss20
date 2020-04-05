from requests_html import HTMLSession
import json
import time


#open browser
session = HTMLSession()

#get website
baseURL = 'https://www.quora.com/search?q=graduate'


page = session.get(baseURL)


titleLists = page.html.find('div.title')
# print(titleLists)

for title in titleLists:
    # print(title.text)
    span = title.find('span')[0]

    print(span.text)





# for list in orderList:
#     print(list.text)

# listItems = allItems.find('li.work.blurb.group')
#
# for item in listItems:
#     heading  =item.find('h4.heading')[0]
#     link  =heading.find('a')
#     title = link[0]
#     authors = link[1:]
#     authorNames = []
#     for author in authors:
#         authorNames.append(author.text)
#
#     infoObject = {
#         'title':title.text,
#         'author':'&'.join(authorNames)
#     }
#     allFans.append(infoObject)
#     print(infoObject)
#     print('---')
#
# with open('data_file.json','w') as write_file:
#     json.dump(allFans,write_file,indent = 4)
