from requests_html import HTMLSession
import json

#open browser
session = HTMLSession()

#get website
baseURL = 'https://archiveofourown.org/tags/Harry%20Potter%20-%20J*d*%20K*d*%20Rowling/works?page='

allFans = list()

for i in range(1,2):

    url = baseURL + str(i)
    print('\n\n\n')
    page = session.get(url)




# print(page)
# print(page.text)

#like get ele by class
    orderList = page.html.find('ol.work.group.index')
    allItems = orderList[0]
    # for list in orderList:
    #     print(list.text)

    listItems = allItems.find('li.work.blurb.group')

    for item in listItems:
        heading  =item.find('h4.heading')[0]
        link  =heading.find('a')
        title = link[0]
        authors = link[1:]
        authorNames = []
        for author in authors:
            authorNames.append(author.text)

        infoObject = {
            'title':title.text,
            'author':'&'.join(authorNames)
        }
        allFans.append(infoObject)
        print(infoObject)
        print('---')

with open('data_file.json','w') as write_file:
    json.dump(allFans,write_file,indent = 4)